/**
 * Use essa função para resolver paths das rotas, mas pode ser usado para outros fins.
 *
 * @param path Caminho que você ira usar
 * @returns O caminho de forma correta
 */
export function resolvePath(path: string) {
    return path?.length ? '/' + path?.split('/').filter(Boolean).join('/') : '/';
}