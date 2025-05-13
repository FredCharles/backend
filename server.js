import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';
import 'dotenv/config'; // Assurez-vous d'avoir installé le package dotenv

const port = process.env.PORT || 5000;
const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Route pour le formulaire de contact
app.post('/send-email', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'contactalarmevo@gmail.com',
    replyTo: email,
    subject: subject,
    text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage: ${message}`,
    html: `<p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur d\'envoi:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.response
      });
    } else {
      console.log('Email envoyé:', info.response);
      res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
        info: info.response
      });
    }
  });
});

// Route pour le formulaire de candidature
app.post('/send-candidature', upload.single('cv'), (req, res) => {
  const { nom, prenom, email, telephone, experience, niveauEtude, specialite } = req.body;
  const cv = req.file;

  const mailOptions = {
    from: email,
    to: 'contactalarmevo@gmail.com',
    subject: 'Nouvelle candidature',
    text: `Nom: ${nom}\nPrénom: ${prenom}\nEmail: ${email}\nTéléphone: ${telephone}\nExpérience: ${experience}\nNiveau d'étude: ${niveauEtude}\nSpécialité: ${specialite}`,
    attachments: cv ? [
      {
        filename: cv.originalname,
        path: cv.path
      }
    ] : []
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.response
      });
    } else {
      console.log('Email envoyé: ' + info.response);
      res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
        info: info.response
      });
    }
  });
});

// Route pour le formulaire de devis
app.post('/send-devis', (req, res) => {
  const { nom, prenom, entreprise, clientType, email, telephone, adresse, codePostal, ville, typeProjet, description, urgence, motivation, raisonDevis } = req.body;

  const mailOptions = {
    from: email,
    to: 'contactalarmevo@gmail.com',
    subject: 'Nouvelle demande de devis',
    text: `Nom: ${nom}\nPrénom: ${prenom}\nEntreprise: ${entreprise}\nType de client: ${clientType}\nEmail: ${email}\nTéléphone: ${telephone}\nAdresse: ${adresse}\nCode Postal: ${codePostal}\nVille: ${ville}\nType de projet: ${typeProjet}\nDescription: ${description}\nUrgence: ${urgence}\nMotivation: ${motivation}\nRaison du devis: ${raisonDevis}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.response
      });
    } else {
      console.log('Email envoyé: ' + info.response);
      res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
        info: info.response
      });
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
