import {PopupButton, PopupParams} from './types';

interface PreparedPopupParams {
  title: string;
  message: string;
  buttons: PopupButton[];
}

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 */
export function preparePopupParams(params: PopupParams): PreparedPopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];

  // Check title.
  if (title.length > 64) {
    throw new Error(`Title has incorrect size: ${title.length}`);
  }

  // Check message.
  if (message.length === 0 || message.length > 256) {
    throw new Error(`Message has incorrect size: ${message.length}`);
  }

  // Check buttons.
  if (buttons.length > 3) {
    throw new Error(`Buttons have incorrect size: ${buttons.length}`);
  }

  // Append button in case, there are no buttons passed.
  if (buttons.length === 0) {
    buttons.push({type: 'close'});
  } else {
    // Otherwise, check all the buttons.
    buttons.forEach(b => {
      const {id = ''} = b;

      // Check button ID.
      if (id.length > 64) {
        throw new Error(`Button ID has incorrect size: ${id}`);
      }

      switch (b.type) {
        case undefined:
        case 'default':
        case 'destructive':
          if (b.text.length > 64) {
            const type = b.type || 'default';
            throw new Error(`Button text with type "${type}" has incorrect size: ${b.text.length}`);
          }
          break;
      }
      b.id = id;
    });
  }
  return {title, message, buttons};
}