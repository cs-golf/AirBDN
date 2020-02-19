import overpy_api

result = overpy_api.bbox_query("57.101011530769,-2.1986389160156,57.206594429377,-2.028694152832")
print(len(result.ways))
print(len(result.nodes))
print(len(result.relations))