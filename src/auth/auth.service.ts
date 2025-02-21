import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import * as sgMail from '@sendgrid/mail';
import { from } from 'rxjs';
import { send } from 'process';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client();
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerUser(username: string, email: string, password: string) {
    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Save user to database
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { message: 'User registered successfully', user };
  }

  async loginUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    user.password = null;
    return { ...user, accessToken: token };
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        id: true,
        username: true,
        created_at: true,
        avatar_url: true,
      },
    });
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Google token is invalid');
      const { sub: googleId, email, name, picture } = payload;

      let user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            username: name,
            avatar_url: picture,
            google_id: googleId,
            password: '',
          },
        });
      }

      const jwtToken = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });
      return { accessToken: jwtToken, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google Authentication');
    }
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) throw new NotFoundException('User Not Found');
    if (
      user.verification_code == otp &&
      user.verification_expires_at >= new Date(Date.now())
    ) {
      console.log('Matched');
      await this.prisma.user.update({
        where: { email },
        data: { is_verified: true },
      });
      console.log(`Updated`);
      user.is_verified = true;
      user.password = null;
      return {
        user: user,
      };
    } else {
      console.log('Not Match');
      return {
        message: 'Verification Code Expired',
      };
    }
  }
  async generateOtp(email: string) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.user.update({
      where: { email },
      data: {
        verification_code: otp,
        verification_expires_at: expiresAt,
      },
    });
    await this.sendOtpEmail(email, otp);
    return otp;
  }

  async sendOtpEmail(email: string, otpvalue: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your OTP for Email Verification',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Email Title</title>
    <style type="text/css">
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #345C72;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            text-align: left;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #1890FF;
        }
        .button {
            display: inline-block;
            background-color: #1890FF;
            color: #FFFFFF;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            background-color: #f2f2f2;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 8px 8px;
        }
        .footer p {
            margin: 5px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Welcome to To be Honest!</h1>
        </div>
        
        <!-- Body -->
        <div class="content">
            <h2 style="color: #345C72;">Hello there!</h2>
            <p>We're excited to have you on board! To get you started, please use the One-Time Password (OTP) below:</p>
            
            <p class="otp">${otpvalue}</p>

            <p>This OTP is valid for the next <strong>10 minutes</strong>. Make sure to enter it promptly to verify your account.</p>
            
            <p>If you didn't request this OTP, please ignore this email.</p>
            
            <!-- Call to Action -->
            <!--<div style="text-align:center; margin-top:20px;">-->
            <!--    <a href="https://www.example.com" target="_blank" class="button">Verify Your Account</a>-->
            <!--</div>-->
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>If you have any questions, feel free to reach out to us at:</p>
            <p><a href="mailto:ujjvaljoshi45@gmail.com">ujjvaljoshi45@gmail.com</a></p>
            <p>Cheers,<br>Ujjval from To be Honest</p>
        </div>
    </div>
</body>
</html>
`,
    };

    await sgMail.send(msg);
  }
}
