// backend/src/services/slackService.js

import axios from 'axios';

const notifySlackTicketCreated = async (ticket, frontendUrl, responsibleName) => {
  const slackEnabled = process.env.SLACK_ENABLED === 'true';
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackEnabled) {
    console.info('Slack integration is waiting for company authorization.');
    return;
  }

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL is not configured. Notification was not sent.');
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
            text: `*Título:*\n${ticket.title}`
          },
          {
            type: 'mrkdwn',
            text: `*Tipo:*\n${ticket.type}`
          },
          {
            type: 'mrkdwn',
            text: `*Urgência:*\n${ticket.priority}`
          },
          {
            type: 'mrkdwn',
            text: `*Responsável:*\n${responsibleName || 'Não atribuído'}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Descrição:*\n${ticket.description}`
        }
      }
    ];

    if (ticket.expected_due_date) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Prazo Esperado:*\n${ticket.expected_due_date}`
        }
      });
    }

    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Ver Chamado'
          },
          value: ticket.id,
          url: `${frontendUrl}/chamados/${ticket.id}`,
          action_id: 'button-view-ticket'
        }
      ]
    });

    await axios.post(webhookUrl, { blocks });

    console.log(`Slack notification sent for ticket ${ticket.id}`);
  } catch (error) {
    console.error('Error sending Slack notification:', error.message);
  }
};

export { notifySlackTicketCreated };
