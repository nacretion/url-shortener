import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from 'typeorm';
import { Link } from './link.entity';

@Entity({ name: 'clicks' })
export class Click {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Link, (l) => l.clicks, { onDelete: 'CASCADE' })
    link!: Link;

    @CreateDateColumn({ type: 'timestamptz' })
    clickedAt!: Date;

    @Column({ type: 'inet' })
    ip!: string;
}
