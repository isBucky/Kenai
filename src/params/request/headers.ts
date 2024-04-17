import { createParamDecorator } from '../../functions/';

/**
 * Use essa função para obter o cabeçalho da requisição
 *
 * @param key Nome do parâmetro que você deseja obter
 */
export const Headers = (key?: string) => createParamDecorator('request/headers', key);
