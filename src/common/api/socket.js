import {io} from 'socket.io-client'

const DOMAIN_NAME = 'http://localhost:5500'

export const socket = io.connect(DOMAIN_NAME)
