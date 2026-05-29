// backend/src/services/slackService.js

import axios from 'axios';

const getPriorityEmoji = (urgencia) => {
  const emojiMap = {
    'Crítica': '🔴',
    'Alta': '🟠',
    'Média': '🟡',
    'Baixa': '🟢'
  };
  return emojiMap[urgencia] || '⚪';
};

const notifySlackTicketCreated = async (chamado, frontendUrl, responsavelNome) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('⚠️ SLACK_WEBHOOK_URL não configurada, notificação não enviada.');
    return;
  }

  try {
    const urgenciaEmoji = getPriorityEmoji(chamado.urgencia);

    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎫 Novo Chamado Criado',
          emoji: true
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
            text: `*Urgência:*\n${urgenciaEmoji} ${chamado.urgencia}`
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
            text: 'Ver Chamado',
            emoji: true
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

    console.log(`✅ Notificação Slack enviada para chamado ${chamado.id}`);
  } catch (error) {
    console.error('❌ Erro ao enviar notificação Slack:', error.message);
  }
};

export { notifySlackTicketCreated };
