import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Offer } from "../offers/offer.entity";
import { User } from "../users/user.entity";

@Entity("auctions")
export class Auction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "numeric" })
  startingPrice!: number;

  @Column({ type: "numeric" })
  currentPrice!: number;

  @Column({ type: "datetime" })
  endDate!: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.auctions, { eager: true })
  @JoinColumn({ name: "sellerId" })
  seller!: User;

  @Column()
  sellerId!: string;

  @OneToMany(() => Offer, (offer) => offer.auction)
  offers!: Offer[];
}
