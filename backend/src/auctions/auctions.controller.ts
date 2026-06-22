import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuctionsService } from "./auctions.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { QueryAuctionsDto } from "./dto/query-auctions.dto";
import { AuctionResponseDto } from "./dto/auction-response.dto";
import { PaginatedAuctionsDto } from "./dto/paginated-auctions.dto";
import { Public } from "../auth/decorators/public.decorator";
import {
  CurrentUser,
  AuthUser,
} from "../auth/decorators/current-user.decorator";

@ApiTags("auctions")
@Controller("auctions")
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "List auctions with filtering and pagination" })
  @ApiOkResponse({ type: PaginatedAuctionsDto })
  findAll(@Query() query: QueryAuctionsDto): Promise<PaginatedAuctionsDto> {
    return this.auctionsService.findAll(query);
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Fetch a single auction" })
  @ApiOkResponse({ type: AuctionResponseDto })
  @ApiNotFoundResponse({ description: "No auction exists with that id" })
  findOne(@Param("id", ParseUUIDPipe) id: string): Promise<AuctionResponseDto> {
    return this.auctionsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create an auction (the seller is the logged-in user)",
  })
  @ApiCreatedResponse({ type: AuctionResponseDto })
  create(
    @Body() dto: CreateAuctionDto,
    @CurrentUser() user: AuthUser,
  ): Promise<AuctionResponseDto> {
    return this.auctionsService.create(dto, user.userId);
  }
}
