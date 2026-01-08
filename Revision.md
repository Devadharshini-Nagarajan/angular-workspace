@for( item of items; track item.id;let idx = $ index, e = $even) {

} @empty {

}


@let user = user$ | async
@let addr = user?.addr

*ngIf = "{ firstname$ | async as firstname, lastname$ | async as lastname } as user"

@switch (val) {
    @case("1") {

    }
}







TODO:
- common snackbar
- common loading - COOP
- how intial load vhecks if token there - COOP
- localstorage save - COOP
- common Loading service - COOP
- token failure redirect signout - high level
- table scrollable, pagination