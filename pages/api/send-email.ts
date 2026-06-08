import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const { type, subject, content } = req.body;

  if (!type || !subject || !content) {
    return res.status(400).json({ message: 'Dados incompletos para envio de e-mail.' });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RECEIVER_EMAIL } = process.env;

  // Se as variáveis de ambiente não estiverem configuradas, simula o envio no console.
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !RECEIVER_EMAIL) {
    console.warn('\n=================== ENVIO DE E-MAIL SIMULADO ===================');
    console.warn('Variáveis de ambiente de e-mail não configuradas (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RECEIVER_EMAIL).');
    console.warn(`Tipo de Briefing: ${type.toUpperCase()}`);
    console.warn(`Assunto: ${subject}`);
    console.warn(`Destinatário (RECEIVER_EMAIL): ${RECEIVER_EMAIL || 'Não configurado'}`);
    console.warn('------------------ CONTEÚDO DO BRIEFING ------------------');
    console.log(content);
    console.warn('================================================================\n');

    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'Briefing recebido e exibido no console do servidor (SMTP não configurado).'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true para 465, false para outras portas (como 587)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${type === 'branding' ? 'Briefing Branding' : type === 'vendas' ? 'Briefing Vendas' : 'Briefing Sindicato'}" <${SMTP_USER}>`,
      to: RECEIVER_EMAIL,
      subject: subject,
      text: content,
    });

    return res.status(200).json({
      success: true,
      message: 'E-mail enviado com sucesso.'
    });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail via SMTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar e-mail.',
      error: error.message || error
    });
  }
}
