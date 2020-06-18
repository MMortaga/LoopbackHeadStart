import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
const config = {
  name: 'postgres',
  connector: 'postgresql',
  url: process.env.DATABASE_URL,
  ssl: true
}

@lifeCycleObserver('datasource')
export class PostgresDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgres';

  constructor(
    @inject('datasources.config.postgres', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
