FROM node:14

RUN apt-get update \
    && apt-get install -y libusb-1.0-0 libusb-1.0-0-dev libudev-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm install -g ganache-cli

# Set the default command for the image
CMD ["ganache-cli", "-h", "0.0.0.0", "--networkId", "50", "--port", "8545"]