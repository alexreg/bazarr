import { faWrench } from "@fortawesome/free-solid-svg-icons";
import {
  useLanguageProfiles,
  useSeries,
  useSeriesModification,
  useSeriesPagination,
} from "apis/hooks";
import { ActionBadge } from "components";
import ItemView from "components/views/ItemView";
import React, { FunctionComponent, useMemo } from "react";
import { Badge, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { BuildKey } from "utilities";

interface Props {}

const SeriesView: FunctionComponent<Props> = () => {
  const { data: profiles } = useLanguageProfiles();
  const mutation = useSeriesModification();

  const query = useSeriesPagination();
  const full = useSeries();

  const columns: Column<Item.Series>[] = useMemo<Column<Item.Series>[]>(
    () => [
      {
        Header: "Name",
        accessor: "title",
        className: "text-nowrap",
        Cell: ({ row, value, isSelecting: select }) => {
          if (select) {
            return value;
          } else {
            const target = `/series/${row.original.sonarrSeriesId}`;
            return (
              <Link to={target}>
                <span>{value}</span>
              </Link>
            );
          }
        },
      },
      {
        Header: "Audio",
        accessor: "audio_language",
        Cell: (row) => {
          return row.value.map((v) => (
            <Badge
              variant="secondary"
              className="mr-2"
              key={BuildKey(v.code2, v.forced, v.hi)}
            >
              {v.name}
            </Badge>
          ));
        },
      },
      {
        Header: "Languages Profile",
        accessor: "profileId",
        Cell: ({ value }) => {
          return profiles?.find((v) => v.profileId === value)?.name ?? null;
        },
      },
      {
        Header: "Episodes",
        accessor: "episodeFileCount",
        selectHide: true,
        Cell: ({ row }) => {
          const { episodeFileCount, episodeMissingCount, profileId, title } =
            row.original;

          let progress = 0;
          let label = "";
          if (episodeFileCount === 0 || !profileId) {
            progress = 0.0;
          } else {
            progress = episodeFileCount - episodeMissingCount;
            label = `${
              episodeFileCount - episodeMissingCount
            }/${episodeFileCount}`;
          }

          const color = episodeMissingCount === 0 ? "primary" : "warning";

          return (
            <ProgressBar
              className="my-a"
              key={title}
              variant={color}
              min={0}
              max={episodeFileCount}
              now={progress}
              label={label}
            ></ProgressBar>
          );
        },
      },
      {
        accessor: "sonarrSeriesId",
        selectHide: true,
        Cell: ({ row, update }) => (
          <ActionBadge
            icon={faWrench}
            onClick={() => {
              update && update(row, "edit");
            }}
          ></ActionBadge>
        ),
      },
    ],
    [profiles]
  );

  return (
    <ItemView
      name="Series"
      fullQuery={full}
      query={query}
      columns={columns}
      mutation={mutation}
    ></ItemView>
  );
};

export default SeriesView;
