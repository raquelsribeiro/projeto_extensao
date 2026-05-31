// backend/src/services/slackService.js

import axios from 'axios';

const notifySlackTicketCreated = async (chamado, frontendUrl, responsavelNome) => {
  const slackEnabled = process.env.SLACK_ENABLED === 'true';
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackEnabled) {
    console.info('Integração Slack aguardando autorização da empresa.');
    return;
  }

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL não configurada, notificação não enviada.');
    return;
  }

  try {
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Novo Chamado Criado'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Título:*\n${chamado.titulo}`
          },
          {
            type: 'mrkdwn',
            text: `*Tipo:*\n${chamado.tipo}`
          },
          {
            type: 'mrkdwn',
            text: `*Urgência:*\n${chamado.urgencia}`
          },
          {
            type: 'mrkdwn',
            text: `*Responsável:*\n${responsavelNome || 'Não atribuído'}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Descrição:*\n${chamado.descricao}`
        }
      }
    ];

    // Adiciona prazo esperado se informado
    if (chamado.prazo_esperado) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Prazo Esperado:*\n${chamado.prazo_esperado}`
        }
      });
    }

    // Adiciona botão para visualizar no frontend
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Ver Chamado'
          },
          value: chamado.id,
          url: `${frontendUrl}/chamados/${chamado.id}`,
          action_id: 'button-view-chamado'
        }
      ]
    });

    // Envia para o Slack
    await axios.post(webhookUrl, {
      blocks: blocks
    });

    console.log(`Notificação Slack enviada para chamado ${chamado.id}`);
  } catch (error) {
    console.error('Erro ao enviar notificação Slack:', error.message);
  }
};

export { notifySlackTicketCreated };
