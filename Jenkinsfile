pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "455440592648"
        ECR_BACKEND = "455440592648.dkr.ecr.us-east-1.amazonaws.com/supermarket-backend"
        ECR_FRONTEND = "455440592648.dkr.ecr.us-east-1.amazonaws.com/supermarket-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker-compose build"
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

        stage('Deploy to Kubernetes') {
            steps {
                sh "minikube image load supermarket-pipeline-frontend:${IMAGE_TAG} || true"
                sh "minikube image load supermarket-pipeline-backend:${IMAGE_TAG} || true"
                sh "kubectl set image deployment/supermarket-frontend frontend=supermarket-pipeline-frontend:${IMAGE_TAG} || true"
                sh "kubectl set image deployment/supermarket-backend backend=supermarket-pipeline-backend:${IMAGE_TAG} || true"
            }
        }

    }
}
