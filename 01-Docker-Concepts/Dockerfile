# Docker file should always start with a 'from' to specify the base image from which we are building 
# These instruction are not case-sensitive, however convention is for them to be uppercase in order to distinguish them from the arguments more easily
FROM debian:jessie

# Run instruction will specify the command(s) to execute that can run on a linux terminal
# Each run instruction will create a new image layer and will then move to the next run making the previous layer as the parent of the next one

# So instead of this
# RUN apt-get update
# RUN apt-get install -y git
# RUN apt-get install -y vim

# Run this to reduce the number of image layers it creates.
RUN apt-get update && apt-get install -y \
    git \
    vim

# COPY instruction copies new files or directories from the build context and adds them to the file-system of the container
COPY copy_test.txt /usr/copy_test.txt

# ADD instruction is quiet similar to copy 
# ADD allows you to download a file from the internet and copy it to the container
# ADD also has the ability to automatically unpack compressed files.


# CMD Instructions
# 1. CMD Instruction specifies what command to run when the container starts up
# 2. If we don't specify CMD instruction in the Dockerfile, Docker will use the default command defined in the base image
# 3. The CMD instruction don't run when we are building an image it only runs when the container starts up.
# 4. You can specify the command in either exec form which is preffered or in shell form.

CMD ["echo", "hello world"]

