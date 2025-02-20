if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <module name>"
    exit 1
fi

nest g module "$1"
nest g service "$1"
nest g controller "$1"