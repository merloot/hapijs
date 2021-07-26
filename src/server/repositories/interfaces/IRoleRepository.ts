
export interface IRoleRepository<T>{

    findIdForBannedRole(): Promise<T | null>;
    findIdForBuyerRole(): Promise<T | null>;
    findIdForDevelopProjectRole(): Promise<T | null>;
    findIdForAdminRole(): Promise<T | null>;
    findIdForSuperAdminRole(): Promise<T | null>;
}
