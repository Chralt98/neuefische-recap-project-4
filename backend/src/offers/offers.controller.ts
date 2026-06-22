import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferResponseDto } from "./dto/offer-response.dto";
import { Public } from "../auth/decorators/public.decorator";
import {
  AuthUser,
  CurrentUser,
} from "../auth/decorators/current-user.decorator";

@ApiTags("offers")
@Controller("auctions/:auctionId/offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Bid history for an auction, highest first" })
  @ApiOkResponse({ type: [OfferResponseDto] })
  @ApiNotFoundResponse({ description: "No auction exists with that id" })
  findAll(
    @Param("auctionId", ParseUUIDPipe) auctionId: string,
  ): Promise<OfferResponseDto[]> {
    return this.offersService.findForAuction(auctionId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Place a bid (the bidder is the logged-in user)" })
  @ApiCreatedResponse({ type: OfferResponseDto })
  @ApiNotFoundResponse({ description: "No auction exists with that id" })
  @ApiForbiddenResponse({ description: "Sellers cannot bid on their own auction" })
  @ApiConflictResponse({
    description: "Auction is closed, or the bid does not beat the current price",
  })
  create(
    @Param("auctionId", ParseUUIDPipe) auctionId: string,
    @Body() dto: CreateOfferDto,
    @CurrentUser() user: AuthUser,
  ): Promise<OfferResponseDto> {
    return this.offersService.placeOffer(auctionId, dto, user.userId);
  }
}
