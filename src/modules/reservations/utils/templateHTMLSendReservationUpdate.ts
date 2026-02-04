export const templateHTMLSendReservationUpdate = (status: string) => {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333;">
      <p>
        Prezado usuário,
      </p>

      <p>
        O status da sua reserva foi atualizado.
      </p>

      <p>
        <strong>Status atual:</strong> ${status}
      </p>

      <p>
        Para mais detalhes, acesse o painel do sistema.
      </p>

      <p>
        Atenciosamente,<br />
        DNC Hotel
      </p>
    </div>
  `;
};
