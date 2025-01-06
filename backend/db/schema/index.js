import { user, genderEnum, userRelations } from "./user.js";
import role from "./role.js";
import blackListToken from "./blacklisttoken.js";
import { address, addressRelations } from "./address.js";
import { service, serviceRelations } from "./service.js";
import { order, orderRelations } from "./order.js";
import { sellerProfile, sellerProfileRelations } from "./sellerProfile.js";
import {
  supportTicket,
  supportTicketRelations,
  ticketStatusEnum,
} from "./supportTicket.js";
import { wallet, walletRelations } from "./wallet.js";
import { review, reviewRelations } from "./review.js";
import message from "./message.js";
import conversation from "./conversation.js";

const schema = [
  user,
  genderEnum,
  userRelations,
  role,
  blackListToken,
  address,
  addressRelations,
  service,
  serviceRelations,
  order,
  orderRelations,
  review,
  reviewRelations,
  sellerProfile,
  sellerProfileRelations,
  supportTicket,
  supportTicketRelations,
  wallet,
  walletRelations,
  message,
  conversation,
  // Add more schemas as needed
];

export default schema;
