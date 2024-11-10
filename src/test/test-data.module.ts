import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestData, TestDataSchema } from './test-data.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TestData.name, schema: TestDataSchema }]),
    ],
    controllers: [TestDataController],
    providers: [TestDataService],
})
export class TestDataModule {}