import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auction } from "../auctions/auction.entity";
import { Offer } from "../offers/offer.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text", unique: true })
  username!: string;

  @Column({ type: "text" })
  password!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @OneToMany(() => Auction, (auction) => auction.seller)
  auctions!: Auction[];

  @OneToMany(() => Offer, (offer) => offer.bidder)
  offers!: Offer[];
}
