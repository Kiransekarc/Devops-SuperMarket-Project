pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
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
                sh 'minikube image load supermarket-pipeline-frontend:latest || true'
                sh 'minikube image load supermarket-pipeline-backend:latest || true'
                sh 'kubectl rollout restart deployment supermarket-frontend || true'
                sh 'kubectl rollout restart deployment supermarket-backend || true'
            }
        }

    }
}
