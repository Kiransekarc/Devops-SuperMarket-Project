pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Kiransekarc/Devops-SuperMarket-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '/usr/local/bin/docker build -t supermarket-app ./backend'
            }
        }

        stage('Run Container') {
            steps {
                sh '/usr/local/bin/docker stop supermarket-app || true'
                sh '/usr/local/bin/docker rm supermarket-app || true'
                sh '/usr/local/bin/docker run -d -p 5000:5000 --name supermarket-app -e MONGO_URI="mongodb://host.docker.internal:27017/supermarketDB" -e JWT_SECRET="your_super_secret_jwt_key_here_change_in_production" -e PORT=5000 supermarket-app'
            }
        }

    }
}
