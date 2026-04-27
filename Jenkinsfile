pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        IMAGE_TAG = "build-${BUILD_NUMBER}"
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
