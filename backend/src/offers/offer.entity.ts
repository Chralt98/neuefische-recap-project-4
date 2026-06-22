import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Auction } from "../auctions/auction.entity";
import { User } from "../users/user.entity";

@Entity("offers")
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "numeric" })
  amount!: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => Auction, (auction) => auction.offers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "auctionId" })
  auction!: Auction;

  @Column()
  auctionId!: string;

  @ManyToOne(() => User, (user) => user.offers, { eager: true })
  @JoinColumn({ name: "bidderId" })
  bidder!: User;

  @Column()
  bidderId!: string;
}
