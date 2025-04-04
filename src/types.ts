interface UserInfoProps {
    id: number;
    name: string;
    email: string;
}

interface RoomJoinListItemProps {
    roomId: number;
    subscriptionId: number | null;
}

type RoomJoinListProps = RoomJoinListItemProps[];

export type {
    UserInfoProps,
    RoomJoinListItemProps,
    RoomJoinListProps,
};

