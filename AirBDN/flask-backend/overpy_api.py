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

    
result = bbox_query("57.101011530769,-2.1986389160156,57.206594429377,-2.028694152832")
print(len(result.ways))
print(len(result.nodes))
print(len(result.relations))
