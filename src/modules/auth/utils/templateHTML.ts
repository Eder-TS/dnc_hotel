export const templateHTML = (userName: string, token: string) => {
  return `
    
        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333;">
            <h1>Reset Password Verification Code</h1>

            <h3>Dear ${userName}:</h3>

            <p>You requested password reset.</p>

            <p>
                Please copy the token below to continue the process:
            </p>

            <div
                style="
                background-color: #f4f4f4;
                border: 1px solid #ddd;
                padding: 12px;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                letter-spacing: 2px;
                margin: 16px 0;
                border-radius: 4px;
                "
            >
                ${token}
            </div>

            <p>
                If you did not request this action,please ignore this email.
            </p>

            <h3>DNC Hotel</h3>
        </div>

    `;
};
