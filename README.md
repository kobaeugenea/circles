[![License badge](https://img.shields.io/badge/license-Apache2-orange.svg)](http://www.apache.org/licenses/LICENSE-2.0)

circles 
=

An openvidu application with a UI customised for meetings in circles. 

Server Installation
==
* First install openVidu servers according to: https://docs.openvidu.io/en/2.14.0/deployment/deploying-on-premises/
* install npm
* git clone https://github.com/kobaeugenea/circles
* cd circles
* npm install
* npm start

Application is configured for standard openvidu ports, should not require any additional configuration.


Local testing
==
docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=192.168.1.139 openvidu/openvidu-server-kms:2.14.0
