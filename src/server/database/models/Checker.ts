import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'

import { Constant, Display, Field, Operation } from '../../../types/checker'
import { User } from './User'
import { UserToChecker } from './UserToChecker'
import { PublishedChecker } from './PublishedChecker'

@Table({ tableName: 'checkers', timestamps: true })
export class Checker extends Model {
  @Column({
    primaryKey: true,
    type: DataType.STRING,
    validate: {
      is: /^[a-z0-9-]+$/,
    },
  })
  id!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  fields!: Field[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  constants!: Constant[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  operations!: Operation[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  displays!: Display[]

  @BelongsToMany(() => User, () => UserToChecker)
  users!: User[]

  @HasMany(() => PublishedChecker)
  publishedCheckers!: PublishedChecker[]
}