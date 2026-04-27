pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        AWS_REGION = "ap-south-1"
        AWS_ACCOUNT_ID = "455440592648"
        ECR_BACKEND = "455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-backend"
        ECR_FRONTEND = "455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker-compose build --no-cache frontend"
                sh "docker-compose build backend"
                sh "docker tag supermarket-pipeline-frontend:latest supermarket-pipeline-frontend:${IMAGE_TAG}"
                sh "docker tag supermarket-pipeline-backend:latest supermarket-pipeline-backend:${IMAGE_TAG}"
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'AWS Access Key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'AWS Secret Key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                sh "aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID"
                sh "aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY"
                sh "aws configure set default.region ${AWS_REGION}"
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                
                // Tag for ECR
                sh "docker tag supermarket-pipeline-backend:${IMAGE_TAG} ${ECR_BACKEND}:${IMAGE_TAG}"
                sh "docker tag supermarket-pipeline-backend:${IMAGE_TAG} ${ECR_BACKEND}:latest"
                sh "docker tag supermarket-pipeline-frontend:${IMAGE_TAG} ${ECR_FRONTEND}:${IMAGE_TAG}"
                sh "docker tag supermarket-pipeline-frontend:${IMAGE_TAG} ${ECR_FRONTEND}:latest"

                // Push to ECR
                sh "docker push ${ECR_BACKEND}:${IMAGE_TAG}"
                sh "docker push ${ECR_BACKEND}:latest"
                sh "docker push ${ECR_FRONTEND}:${IMAGE_TAG}"
                sh "docker push ${ECR_FRONTEND}:latest"
                }
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker-compose down --remove-orphans || true'
                sh 'docker stop supermarket-backend supermarket-frontend || true'
                sh 'docker rm -f supermarket-backend supermarket-frontend || true'
                sh 'docker-compose up -d'
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    string(credentialsId: 'AWS Access Key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'AWS Secret Key', variable: 'AWS_SECRET_ACCESS_KEY'),
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY')
                ]) {
                    sh """
                        chmod 600 \$SSH_KEY
                        ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ubuntu@13.232.107.25 '
                            sudo chmod 666 /var/run/docker.sock
                            aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                            aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                            aws configure set default.region ap-south-1
                            aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 455440592648.dkr.ecr.ap-south-1.amazonaws.com
                            docker pull 455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-backend:latest
                            docker pull 455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-frontend:latest
                            docker rm -f supermarket-backend supermarket-frontend || true
                            docker network create supermarket-net || true
                            docker run -d --name supermarket-backend --network supermarket-net -p 5000:5000 -e MONGO_URI="mongodb+srv://admin:admin@supermarketcluster.0cdcsoq.mongodb.net/supermarketDB?retryWrites=true&w=majority&appName=SuperMarketCluster" -e JWT_SECRET="your_super_secret_jwt_key_here_change_in_production" -e PORT=5000 455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-backend:latest
                            docker run -d --name supermarket-frontend --network supermarket-net -p 3000:3000 455440592648.dkr.ecr.ap-south-1.amazonaws.com/supermarket-frontend:latest
                        '
                    """
                }
            }
        }

    }
}
