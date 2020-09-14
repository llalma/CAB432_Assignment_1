FROM node:latest

#Check upto date and install git
RUN apt-get -y update && apt-get install -y git

#Get current repo of the assignment
RUN git clone https://1c1a2a27864be7e4328d44ebd8ff0f6b3b123a01@github.com/llalma/CAB432_Assignment_1.git

#
WORKDIR CAB432_Assignment_1/reddit/

RUN npm install

#Listen on port 3000
EXPOSE 3000

#Run File
CMD [ "node", "app.js" ]
