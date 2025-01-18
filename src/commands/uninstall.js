// commands/link.js
import logger from '../utils/logger.js';
import path from 'path';
/**
 * Handles the 'uninstall' command.
 * @param {WebSocketClient} wsClient - The WebSocket client instance.
 * @param {Object} options - The command options.
 */
export default async function uninstallCommand(wsClient, options) {
  const cmd = {
    cmd: 'plugin',
    operation: 'uninstall',
    uuid: options.uuid,
  }

  try {
    const response = await wsClient.sendCommand(cmd);
    if (response.payload.result === 'success') {
      logger.info(`Uninstall command successful: ${JSON.stringify(response, null, 2)}`);
    } else {
      logger.error(`Uninstall command failed: ${JSON.stringify(response, null, 2)}`);
    }
  } catch (error) {
    logger.error(`Error in uninstall command: ${error.message}`);
  }
}
