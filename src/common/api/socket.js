import {io} from 'socket.io-client'

const DOMAIN_NAME = 'https://malasakit-api.onrender.com'

export const socket = io.connect(DOMAIN_NAME)
