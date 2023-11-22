import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
} from 'typeorm';
import { TABLE_PRODUCT_NAME } from '../constant/db.constant';
import ObjectID from 'bson-objectid';

@Entity(TABLE_PRODUCT_NAME)
export class Product {
  @PrimaryColumn({ type: 'varchar', length: 50, nullable: false, unique: true })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  product_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  product_thumb: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_slug: string;

  @Column({ type: 'text', nullable: true })
  product_description: string;

  @Column({ type: 'double precision', nullable: false })
  product_price: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  product_type: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  product_shop: string;

  @Column({ type: 'jsonb', nullable: false })
  product_attributes: any;

  @Column({ type: 'double precision', default: 4.5, nullable: false })
  product_ratingAverage: number;

  @Column({ type: 'jsonb', nullable: true })
  product_variation: any[];

  @Column({ type: 'boolean', default: true })
  isDraft: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'text', nullable: true })
  product_images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUUID() {
    if (!this.id) {
      this.id = ObjectID().toHexString();
    }
  }
}
