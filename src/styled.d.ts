import 'styled-components';
import 'styled-components/native';

declare module 'styled-components/native' {
    export interface DefaultTheme {
        // Primary Button
        primaryButtonBlue: string;
        primaryButtonBorder: string;

        // Banner
        BannerColor: string;
        BannerColorShadow: string;

        // Main Screen Button
        MainScreenButtonLabel: string;
        MainScreenButtonBackGround: string;
        MainScreenButtonBorder: string;
        MainScreenButtonShadow: string;

        // Category Card
        CategoryCardBackground: string;
        CategoryCardBorder: string;
        CategoryCardText: string;

        // Game Overview
        OverviewItemBackground: string;
        OverviewItemBorder: string;
        OverviewShadow: string;
        OverViewLabel: string;
        OverViewValue: string;

        // Game rules Content
        GameRulesTextColor: string;

        // Modal
        ModalCardBackground: string;
        ModalCardBorder: string;
        ModalTextColor: string;
        ModalButtonBackground: string;
        ModalButtonBorder: string;
        ModalButtonTextColor: string;
        ModalCancelButtonBackground: string;
        ModalCancelButtonTextColor: string;

        // Top bar
        TopBarBackground: string;
        TopBarExitButtonBackground: string;
        TopBarUndoButtonBackground: string;
        TopBarButtonBorder: string;
        TopBarButtonTextColor: string;
        TopBarTimerColor: string;

        // Screen Container
        ScreenContainerBackground: string;

        // Setup Grid
        SetupGridLabelColor: string;
        SetupGridInputBackground: string;
        SetupGridInputBorder: string;
        SetupGridInputShadow: string;
        SetupGridInputColor: string;

        // Game End Screen
        TeamRowBackground: string;
        TeamNameColor: string;
        TeamScoreColor: string;
        SubBannerColor: string;
        TeamsScrollBorder: string;
        TeamsScrollBackground: string;
        TeamShadowColor: string;
        TeamWhiteShadowColor: string;

        // Game screen
        GameScreenContainerBackground: string;
        GameScreenContainerBorder: string;
        CardsLeftTextColor: string;
        CurrentStreakColor: string;
        WordTextColor: string;
        HintTextColor: string;

        // Player Turn Screen
        PlayerTurnTeamNameColor: string;
        PlayerTurnPlayerNameColor: string;
        PlayerTurnPlayerNameShadow: string;
        PlayerTurnReadyTextColor: string;
        PlayerTurnTimeLeftTextColor: string;

        // QuickGameScreen
        QuickGameScreenBackground: string;
        QuickGameScreenLabelColor: string;
        QuickGameScreenSubheaderColor: string;
        QuickGameScreenSelectAllButtonSelectedBg: string;
        QuickGameScreenSelectAllButtonUnselectedBg: string;
        QuickGameScreenSelectAllButtonSelectedBorder: string;
        QuickGameScreenSelectAllButtonUnselectedBorder: string;
        QuickGameScreenSelectAllButtonShadow: string;
        QuickGameScreenSelectAllTextSelected: string;
        QuickGameScreenSelectAllTextUnselected: string;
        QuickGameScreenActivityIndicator: string;

        // Round End Screen
        RoundEndTeamShadowColor: string;
        RoundEndTeamWhiteShadowColor: string;
        RoundEndTeamNameColor: string;
        RoundEndTeamScoreColor: string;
        RoundEndTeamsScrollBorder: string;
        RoundEndTeamsScrollBackground: string;

        // SetupScreen colors
        SetupModalBackground: string;
        SetupModalBorder: string;
        SetupModalText: string;
        SetupCloseButtonBackground: string;
        SetupCloseButtonText: string;
        SetupButtonQuickGameBackground: string;
        SetupButtonCustomGameBackground: string;
        SetupButtonBorder: string;
        SetupButtonText: string;
        SetupInfoButtonBackground: string;
        SetupInfoButtonBorder: string;
        SetupInfoButtonText: string;

        // SubmitPlayerNamesScreen colors
        SubmitLabelColor: string;
        SubmitNameInputBackground: string;
        SubmitNameInputBorder: string;
        SubmitNameInputShadow: string;
        SubmitAddButtonBackground: string;
        SubmitAddButtonBorder: string;
        SubmitAddButtonText: string;
        SubmitRandomButtonBackground: string;
        SubmitRandomButtonBorder: string;
        SubmitRandomButtonText: string;
        SubmitNameItemBackground: string;
        SubmitNameItemBorder: string;
        SubmitNameItemShadow: string;
        SubmitNameText: string;
        SubmitNamesEnteredText: string;

        // SubmitWordsScreen colors
        SubmitWordsLabelColor: string;
        SubmitWordsInputBackground: string;
        SubmitWordsInputBorder: string;
        SubmitWordsInputShadow: string;
        SubmitWordsActionButtonBackground: string;
        SubmitWordsActionButtonBorder: string;
        SubmitWordsActionButtonShadow: string;
        SubmitWordsAddHatButtonBackground: string;
        SubmitWordsAddButtonText: string;
        SubmitWordsGridItemBackground: string;
        SubmitWordsGridItemBorder: string;
        SubmitWordsGridItemText: string;
        SubmitWordsRemoveText: string;
        SubmitWordsCountText: string;
        SubmitWordsFillRandomButtonBackground: string;
        SubmitWordsFillRandomButtonBorder: string;
        SubmitWordsFillRandomButtonShadow: string;
        SubmitWordsFillRandomText: string;

        // Team Overview
        TeamCardBackground: string;
        TeamCardBorder: string;
        TeamCardShadow: string;
        PlayerNameColor: string;
    }
}