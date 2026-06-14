const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Abilita i permessi CORS per consentire i test in locale da localhost
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Risposta rapida per le pre-chiamate di controllo del browser (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metodo non consentito' });
    return;
  }

  try {
    const { amount } = req.body;

    if (!amount) {
      res.status(400).json({ error: 'Importo mancante' });
      return;
    }

    // Crea il PaymentIntent su Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Converte l'importo in centesimi per Stripe (es: 34.00 diventa 3400)
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true, // Abilita in automatico Carte di Credito, Apple Pay e Google Pay
      },
    });

    // Restituisce il Client Secret necessario a React per completare il pagamento
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe Server Error:', error);
    res.status(500).json({ error: error.message });
  }
};