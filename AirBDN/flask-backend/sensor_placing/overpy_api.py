import overpy


# return all houses inside a boundary box
def bbox_query(coordinate):
    query = """[out:json]
    ;
    (
        node
            ["addr:housenumber"]
            ({0});
        way
            ["addr:housenumber"]
            ({0});
        relation
            ["addr:housenumber"]
            ({0});

    );
    out;
    >;
    out skel qt;
    """

    result = overpy.Overpass().query(query.format(coordinate))

    return result
