// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {User} from '../models';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {


  constructor(
    @inject('datasources.postgres') dataSource: juggler.DataSource,
  ) {
    super(User, dataSource);
  }
}
