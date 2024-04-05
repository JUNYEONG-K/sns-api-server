import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Hashtags } from '@prisma/client';
import { HashtagDto } from './dto/response/hashtag.dto';

@Injectable()
export class HashtagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateHashTag(tag: string): Promise<Hashtags> {
    return await this.prisma.hashtags.upsert({
      where: { tag },
      create: { tag },
      update: {},
    });
  }

  async registerHashtag(tag: string): Promise<HashtagDto> {
    const hashtag = await this.findOrCreateHashTag(tag);
    return this.buildHashtagDto(hashtag);
  }

  buildHashtagDto(hashtag: Hashtags): HashtagDto {
    return hashtag;
  }

  async getHashtagsStartsWith(tagQ: string): Promise<Hashtags[]> {
    return await this.prisma.hashtags.findMany({
      where: { tag: { startsWith: tagQ } },
      // TODO: order by - feeds 개수만큼 할 수 있을 듯
    });
  }

  async getHashtags(tagQ: string): Promise<HashtagDto[]> {
    const hashtags = await this.getHashtagsStartsWith(tagQ);
    return hashtags.map((hashtag) => this.buildHashtagDto(hashtag));
  }
}
