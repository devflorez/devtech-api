export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  wompi: {
    publicKey: process.env.WOMPI_PUBLIC_KEY,
    privateKey: process.env.WOMPI_PRIVATE_KEY,
    apiUrl: process.env.WOMPI_API_URL,
    integrity: process.env.WOMPI_INTEGRITY_KEY,
  },
});
