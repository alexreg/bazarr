import { useLanguageProfiles, useLanguages } from "apis/hooks";
import { isArray } from "lodash";
import React, { FunctionComponent } from "react";
import { useEnabledLanguages } from "utilities/languages";
import {
  Check,
  CollapseBox,
  Group,
  Input,
  Message,
  SettingsProvider,
  useLatest,
} from "../components";
import { enabledLanguageKey, languageProfileKey } from "../keys";
import { LanguageSelector, ProfileSelector } from "./components";
import Table from "./table";

export function useLatestEnabledLanguages() {
  const { data } = useEnabledLanguages();
  const latest = useLatest<Language.Info[]>(enabledLanguageKey, isArray);

  if (latest) {
    return latest;
  } else {
    return data;
  }
}

export function useLatestProfiles() {
  const { data = [] } = useLanguageProfiles();
  const latest = useLatest<Language.Profile[]>(languageProfileKey, isArray);

  if (latest) {
    return latest;
  } else {
    return data;
  }
}

interface Props {}

const SettingsLanguagesView: FunctionComponent<Props> = () => {
  const { data: languages } = useLanguages();

  return (
    <SettingsProvider title="Languages - Bazarr (Settings)">
      <Group header="Subtitles Language">
        <Input>
          <Check
            label="Single Language"
            settingKey="settings-general-single_language"
          ></Check>
          <Message>
            Download a single Subtitles file without adding the language code to
            the filename.
          </Message>
          <Message type="warning">
            We don't recommend enabling this option unless absolutely required
            (ie: media player not supporting language code in subtitles
            filename). Results may vary.
          </Message>
        </Input>
        <Input name="Languages Filter">
          <LanguageSelector
            settingKey={enabledLanguageKey}
            options={languages ?? []}
          ></LanguageSelector>
        </Input>
      </Group>
      <Group header="Languages Profiles">
        <Table></Table>
      </Group>
      <Group header="Default Settings">
        <CollapseBox>
          <CollapseBox.Control>
            <Input>
              <Check
                label="Series"
                settingKey="settings-general-serie_default_enabled"
              ></Check>
              <Message>
                Apply only to Series added to Bazarr after enabling this option.
              </Message>
            </Input>
          </CollapseBox.Control>
          <CollapseBox.Content indent>
            <Input name="Profile">
              <ProfileSelector settingKey="settings-general-serie_default_profile"></ProfileSelector>
            </Input>
          </CollapseBox.Content>
        </CollapseBox>
        <CollapseBox>
          <CollapseBox.Control>
            <Input>
              <Check
                label="Movies"
                settingKey="settings-general-movie_default_enabled"
              ></Check>
              <Message>
                Apply only to Movies added to Bazarr after enabling this option.
              </Message>
            </Input>
          </CollapseBox.Control>
          <CollapseBox.Content>
            <Input name="Profile">
              <ProfileSelector settingKey="settings-general-movie_default_profile"></ProfileSelector>
            </Input>
          </CollapseBox.Content>
        </CollapseBox>
      </Group>
    </SettingsProvider>
  );
};

export default SettingsLanguagesView;
