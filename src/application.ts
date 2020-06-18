import { BootMixin } from '@loopback/boot';
import {
  ApplicationConfig,
  BindingKey,
  createBindingFromClass,
} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {
  model,
  property,
  RepositoryMixin,
  SchemaMigrationOptions,
} from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import path from 'path';
import { MySequence, MyAuthenticationSequence } from './sequence';
import { AuthenticationComponent } from '@loopback/authentication';
import { AuthorizationComponent } from '@loopback/authorization';
import { ServiceMixin } from '@loopback/service-proxy';
import fs from 'fs';
import _ from 'lodash';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import { User } from './models';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { JWTService } from './services/jwt-service';
import { MyUserService } from './services/user-service';
import YAML = require('yaml');
import {
  UserRepository
} from './repositories';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

@model()
export class NewUser extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class LoopbackTemplateApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.setUpBindings();

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // authentication
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }

  // Unfortunately, TypeScript does not allow overriding methods inherited
  // from mapped types. https://github.com/microsoft/TypeScript/issues/38496
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async start(): Promise<void> {
    // Use `databaseSeeding` flag to control if products/users should be pre
    // populated into the database. Its value is default to `true`.
    // if (this.options.databaseSeeding !== false) {
    //   await this.migrateSchema();
    // }
    
    return super.start();
  }
}