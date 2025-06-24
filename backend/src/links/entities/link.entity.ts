import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Click } from './click.entity';

@Entity({ name: 'links' })
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 20, unique: true })
    alias!: string;

    @Column()
    originalUrl!: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    expiresAt?: Date | null;

    @OneToMany(() => Click, (c) => c.link, { cascade: true })
    clicks!: Click[];

    clickCount = 0;
}
