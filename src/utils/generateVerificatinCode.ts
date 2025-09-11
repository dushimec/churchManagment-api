export const generateVerificationCode = (exp: number) =>{
  const verificationCode = Math.floor(Math.random() * 9000) + 1000 + "";
  const verificationCodeExpiresAt = new Date(Date.now() + exp);

        return {
            verificationCode,
            verificationCodeExpiresAt
        }
}