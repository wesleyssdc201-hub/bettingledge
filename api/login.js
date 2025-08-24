// api/login.js
import admin from 'firebase-admin';

// Inicialize o Firebase Admin SDK com a chave secreta
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("Erro ao inicializar o Firebase Admin SDK:", error);
        // Retornar um erro genérico para não expor detalhes de segurança
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        
        res.status(200).json({ customToken });
    } catch (error) {
        console.error("Erro de login:", error);
        res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
}