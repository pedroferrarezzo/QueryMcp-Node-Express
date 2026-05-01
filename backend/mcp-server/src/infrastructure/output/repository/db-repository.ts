/**
 * Repositório genérico para acesso a banco de dados
 */
export interface DbRepository {
  /**
   * Retorna o schema do banco de dados
   */
  getSchema(): Promise<any>;

  /**
   * Executa uma query
   * @param query string com a query
   * @param params parâmetros opcionais
   */
  executeQuery<T = any>(query: string, params?: Record<string, any>): Promise<T[]>;
}