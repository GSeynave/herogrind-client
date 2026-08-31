import type {PartyType} from "./PartyType";
import type {HeroPartyInfo} from "./HeroPartyInfo";

export type Party={
        id: string,
        name: string,
        maxSize: number,
        members: HeroPartyInfo[],
        areaId: string | null,
        partyType: PartyType
}